<?php

class Router {

  private static $instance;
  public static function instance() {
    return self::$instance;
  }

  protected $xps;
  protected $routes;

  /**
   * Creates a router.
   *
   * @param XPSService $xps The XPS service to invoke.
   */
  public function __construct() {
    self::$instance = $this;
    $this->routes = array();
  }

  public function get($path, $invocation, $options = array()) {
    $options['methods'] = array('GET');
    $this->match($path, $invocation, $options);
  }

  public function post($path, $invocation, $options = array()) {
    $options['methods'] = array('POST');
    $this->match($path, $invocation, $options);
  }

  public function put($path, $invocation, $options = array()) {
    $options['methods'] = array('PUT');
    $this->match($path, $invocation, $options);
  }

  public function delete($path, $invocation, $options = array()) {
    $options['methods'] = array('DELETE');
    $this->match($path, $invocation, $options);
  }

  public function match($path, $invocation, $options = array()) {
    $methods = $options['methods'];
    if (empty($methods)) {
      $methods = array('GET', 'POST', 'PUT', 'DELETE');
    }

    $this->routes[] = array(
      'path'       => $path,
      'methods'    => $methods,
      'invocation' => $invocation,
      'options'    => $options
    );
  }

  public function invoke($method, $path) {
    $found = false;

    foreach ($this->routes as $route) {
      if ($this->matchRoute($route, $method, $path, $routeParameters)) {
        $this->invokeRoute($route, $routeParameters);
        $found = true;
        break;
      }
    }

    if (!$found) {
      http_response_code(404);
      header('Content-Type: application/json');
      $json = json_encode(array('error' => "no route found for `$method $path`"), JSON_UNESCAPED_SLASHES);
      echo $json;
      return;
    }
  }

  protected function matchRoute($route, $method, $path, &$routeParameters) {
    if (!in_array($method, $route['methods'])) {
      return false;
    }

    // Split up the route and given path in segments, and match each of them.
    $routeSegments = explode('/', preg_replace('=^[\s/]+|[\s/]+$=', '', $route['path']));
    $pathSegments  = explode('/', preg_replace('=^[\s/]+|[\s/]$=', '', $path));

    $nextPathSegment = function() use (&$pathSegments) {
      do {
        $segment = trim(array_shift($pathSegments));
      } while (empty($segment) && count($pathSegments) > 0);

      return $segment;
    };

    $routeParameters = array();

    while (count($routeSegments) > 0) {
      $routeSegment = trim(array_shift($routeSegments));

      if ($routeSegment == '') {
        continue;
      }
      if ($routeSegment[0] == ':') {
        // Parameter
        $routeParameters[substr($routeSegment, 1)] = $nextPathSegment();
      } else if ($routeSegment != $nextPathSegment()) {
        // Route does not match.
        return false;
      }
    }

    // Only match if we have used all path segments.
    return count($pathSegments) == 0;
  }

  protected function invokeRoute($route, $routeParameters) {
    list($controllerName, $action) = explode('#', $route['invocation']);

    $controllerClass = $this->pascalize($controllerName) . 'Controller';

    if (!class_exists($controllerClass)) {
      require_once __DIR__.'/controller.class.php';
      require_once __DIR__.'/../app/controllers/'.$controllerName.'_controller.class.php';
    }
    $controller = new $controllerClass();

    $controller->invokeAction($action, $routeParameters);
  }

  private function pascalize($string) {
    $string = preg_replace('/^[^\w0-9]|[^\w0-9]$/', '', $string);
    return preg_replace_callback('/(?:^|[^\w0-9]+)([\w0-9])/', function ($match) {
      return mb_strtoupper($match[1]);
    }, $string);
  }

}