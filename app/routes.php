<?php

$router = Router::instance();

$router->get('/partijen', 'partijen#index');
$router->get('/candidates', 'candidates#stack');

$router->post('/results', 'results#create');