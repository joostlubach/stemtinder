<?php

class HttpException extends RuntimeException {

  private $status;

  public function __construct($status, $message) {
    parent::__construct($message);
    $this->status = $status;
  }

  public function getStatus() {
    return $this->status;
  }

}

