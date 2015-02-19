<?php

require_once __DIR__.'/../vendor/autoload.php';

header('Access-Control-Allow-Origin: *');

// Check for a CORS preflight check.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' && isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {

  // Perform the CORS preflight - we allow pretty much everything.
  header('Access-Control-Allow-Headers: X-Authorization, Accept, Content-Type, Origin, X-XPS-Client');
  header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE');

} else {

  $router = new Router();
  require __DIR__.'/../app/routes.php';

  // Read input configuration.
  $path = $_SERVER['PATH_INFO'];
  if (empty($path)) {
    $path = preg_replace('/\?.*$/', '', $_SERVER['REQUEST_URI']);
  }

  $router->invoke($_SERVER['REQUEST_METHOD'], $path);

}