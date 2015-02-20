<?php

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

Dotenv::load(__DIR__.'/..');

class App {

  static $entityManager = null;

  static function getEntityManager() {
    if (!self::$entityManager) {
      $paths = array(__DIR__.'/../app/entities');
      $isDevMode = getenv('ENV') == 'dev';
      $proxyDir = __DIR__ . '/../tmp';

      $dbParams = array(
          'driver'   => 'pdo_mysql',
          'host'     => getenv('DB_HOST'),
          'user'     => getenv('DB_USERNAME'),
          'password' => getenv('DB_PASSWORD'),
          'dbname'   => getenv('DB_DATABASE')
      );

      $config = Setup::createAnnotationMetadataConfiguration($paths, $isDevMode, $proxyDir);
      self::$entityManager = EntityManager::create($dbParams, $config);
    }

    return self::$entityManager;
  }

}