<?php

require_once __DIR__.'/vendor/autoload.php';

header('Access-Control-Allow-Origin: *');

error_reporting(0);
set_error_handler('__handleError');
register_shutdown_function('__handleFatal');
function __handleError($errno, $errstr) {
  header('HTTP/1.1 500 Server Error');
  header('Content-Type', 'application/json');
  die(json_encode(array('error' => array('code' => $errno, 'message' => $errstr))));
}
function __handleFatal() {
  if ($error = error_get_last()) {
    if ($error['type'] == E_ERROR) {
      header('HTTP/1.1 500 Server Error');
      header('Content-Type', 'application/json');
      die(json_encode(array('error' => $error)));
    }
  }
}

// Check for a CORS preflight check.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' && isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {

  // Perform the CORS preflight - we allow pretty much everything.
  header('Access-Control-Allow-Headers: X-Authorization, Accept, Content-Type, Origin, X-XPS-Client');
  header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE');

} else {

  $router = new Router();
  require __DIR__.'/app/routes.php';

  // Read input configuration.
  $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : null;
  if (empty($path)) {
    $path = preg_replace('/\?.*$/', '', $_SERVER['REQUEST_URI']);
  }

  $router->invoke($_SERVER['REQUEST_METHOD'], $path);

}