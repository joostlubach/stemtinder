<?php

class StaticData {

  protected $root;
  protected $memcached;

  public function __construct() {
    $this->root = __DIR__ . '/../www/data';

    $this->memcached = new Memcached();
    $this->memcached->addServer(getenv('MEMCACHED_SERVER'), getenv('MEMCACHED_PORT'));
  }

  public function get($path) {
    $self = $this;

    $data = $this->memcached->get("static-data:$path");
    if ($data) {
      return $data;
    } else {
      $fullPath = $this->root . $path;
      $data = json_decode(file_get_contents($fullPath), true);
      $this->memcached->set("static-data:$path", $data, 60);

      return $data;
    }
  }

  public function clearCache($path) {
    $this->memcached->delete($path);
  }


}