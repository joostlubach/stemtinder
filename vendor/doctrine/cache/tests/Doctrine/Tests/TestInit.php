<?php
/*
 * This file bootstraps the test environment.
 */
error_reporting(E_ALL | E_STRICT);

if (file_exists(dirname(__FILE__) . '/../../../vendor/autoload.php')) {
    // dependencies were installed via composer - this is the main project
    $classLoader = require dirname(__FILE__) . '/../../../vendor/autoload.php';
} elseif (file_exists(dirname(__FILE__) . '/../../../../../autoload.php')) {
    // installed as a dependency in `vendor`
    $classLoader = require dirname(__FILE__) . '/../../../../../autoload.php';
} else {
    throw new Exception('Can\'t find autoload.php. Did you install dependencies via Composer?');
}

/* @var $classLoader \Composer\Autoload\ClassLoader */
$classLoader->add('Doctrine\\Tests\\', dirname(__FILE__) . '/../../');
unset($classLoader);
