<?php

$router = Router::instance();

$router->get('/partijen', 'partijen#index');
$router->get('/candidates/stack', 'candidates#stack');
$router->get('/candidates/clear-cache', 'candidates#clearCache');