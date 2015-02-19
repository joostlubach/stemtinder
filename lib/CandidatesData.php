<?php

class CandidatesData extends StaticData {

  protected function readData() {
    $path = __DIR__ . '/../www/data/all.json';
    return json_decode(file_get_contents($path), true);
  }

  public function stack($province) {
    $data = $this->readData();

    $candidates = $data['candidates'][$province];
    shuffle($candidates);

    return $candidates;
  }

}