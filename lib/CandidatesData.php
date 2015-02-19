<?php

class CandidatesData extends StaticData {

  public function stack($province) {
    $data = $this->get('/all.json');

    $candidates = $data['candidates'][$province];
    shuffle($candidates);

    return $candidates;
  }

}