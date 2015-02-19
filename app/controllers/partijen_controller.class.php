<?php

class PartijenController extends Controller {

  public function index($parameters) {
    $data = new StaticData();

    return $data->get('/partijen/pvda');

  }

}