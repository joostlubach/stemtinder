<?php

class CandidatesData extends StaticData {

  public function stack($province) {
    $data = $this->get('/all.json');
    var_dump($data); die();

    $candidates = $data['candidates'][$province];
    shuffle($candidates);

    return $candidates;
  }

}