<?php
/*
 * This file bootstraps the test environment.
 */
namespace Doctrine\Tests;

error_reporting(E_ALL | E_STRICT);

// register silently failing autoloader
spl_autoload_register(function($class)
{
    if (0 === strpos($class, 'Doctrine\Tests\\')) {
        $path = dirname(__FILE__).'/../../'.strtr($class, '\\', '/').'.php';
        if (is_file($path) && is_readable($path)) {
            require_once $path;

            return true;
        }
    } else if (0 === strpos($class, 'Doctrine\Common\\')) {
        $path = dirname(__FILE__).'/../../../lib/'.($class = strtr($class, '\\', '/')).'.php';
        if (is_file($path) && is_readable($path)) {
            require_once $path;

            return true;
        }
    }
});
