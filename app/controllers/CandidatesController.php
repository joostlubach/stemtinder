<?php

class CandidatesController extends Controller {

  public function stack($parameters) {
    $data = new CandidatesData();
    return $data->stack($parameters['province']);
  }

}