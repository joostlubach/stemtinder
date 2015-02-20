<?php

class Controller {

  protected $em;

  public function __construct() {
    $this->em = App::getEntityManager();
  }

  protected function loadParameters() {
    if (in_array($_SERVER['REQUEST_METHOD'], array('POST', 'PUT', 'PATCH'))) {
      // Read parameters from JSON.
      $parameters = json_decode(file_get_contents('php://input'), true);
    } else {
      // Read parameters from query string.
      $parameters = $_GET;
    }
    if (!$parameters) { $parameters = array(); }

    return $parameters;
  }

  protected function handleHttpException($exception) {
    $this->renderError($exception->getStatus(), $exception->getMessage());
  }

  protected function renderError($status, $message) {
    header("HTTP/1.1 $status");
    $json = json_encode(array('error' => $message));
    echo str_replace('\\/', '/', $json);
  }

  public function invokeAction($action, $routeParameters) {
    header('Content-Type: application/json');

    try {
      $parameters = array_merge($this->loadParameters(), $routeParameters);
      $result = call_user_func(array($this, $action), $parameters);
      $json = json_encode($result);

      echo str_replace('\\/', '/', $json);
    } catch (HttpException $ex) {

      $this->handleHttpException($ex);

    }
  }

  /**
   * Extracts out properties to use from the source array.
   *
   * @param mixed $items     the array of items to extract the data from
   * @param mixed $map
   *   A mapping from source items - the keys are the properties to fill in the results array, and the
   *   values are 'key paths' to where the data should come from. You may also specify a callable as a,
   *   like in {@link #inject}.
   *
   * @example
   *
   *     $schemas = $this->extract($schemas, array(
   *       'id'          => 'schemaid',
   *       'description' => 'description'
   *     ));
   *
   */
  protected function extract($items, $map) {
      $results = array();

      foreach ($items as &$item) {
          $result = array();

          foreach ($map as $dest => $src) {
              if (is_callable($src)) {
                  $this->setValue($result, $dest, $src($item));
              } else if (preg_match('/^(?:(.*)\.|^)\*$/', $src, $matches)) {
                  if (count($matches) > 1) {
                      $sourceArray = $this->getValue($item, $matches[1]);
                  } else {
                      $sourceArray = $item;
                  }

                  foreach ($sourceArray as $key => $value) {
                      $currentDest = str_replace('*', $key, $dest);
                      $this->setValue($result, $currentDest, $value);
                  }
              } else {
                  $this->setValue($result, $dest, $this->getValue($item, $src));
              }
          }

          $results[] = $result;
      }

      return $results;
  }

  /**
   * Sets a value for an item at the given key path.
   *
   * @example
   *
   *     $item = array('one' => 2)
   *     $this->setValue($item, 'one', 1);
   *     $this->getValue($item, 'two.three', 3);
   *
   *     // $item = array('one' => 1, 'two' => array('three' => 3))
   */
  protected function setValue(&$item, $path, $value) {
      $current  = &$item;
      $segments = explode('.', $path);
      $tail     = array_pop($segments);
      foreach ($segments as $segment) {
          if (!$segment || trim($segment) == '') continue;

          if (!array_key_exists($segment, $current) || !$current[$segment]) {
              $current[$segment] = array();
          }
          $current = &$current[$segment];
      }
      $current[$tail] = $value;
  }

  /**
   * Gets a value from an item at the given key path.
   *
   * @example
   *
   *     $item = array('one' => 1, 'two' => array('three' => 3))
   *     $this->getValue($item, 'one');       // => 1
   *     $this->getValue($item, 'two');       // => array('three' => 3)
   *     $this->getValue($item, 'two.three'); // => 3
   *     $this->getValue($item, 'four.five'); // => null
   */
  protected function getValue(&$item, $path) {
      $current = &$item;
      foreach (explode('.', $path) as $segment) {
          if (!$current) break;
          if (!$segment || trim($segment) == '') continue;

          if (array_key_exists($segment, $current)) {
              $current = &$current[$segment];
          } else {
              unset($current); // Required, otherwise the reference is set to null.
              $current = null;
          }
      }
      return $current;
  }

}