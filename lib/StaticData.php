<?php

class StaticData {

  protected $root;

  public function __construct() {
    $this->root = __DIR__ . '/../data';
  }

  public function get($path) {
    $fullPath = $this->root . $path;

    $jsonPath = "$fullPath.json";

    return json_decode(file_get_contents($jsonPath));
  }

}