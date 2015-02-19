<?php

$router = Router::instance();

$router->get('/partijen', 'partijen#index');
$router->get('/candidates/stack', 'candidates#stack');