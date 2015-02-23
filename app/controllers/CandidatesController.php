<?php

class CandidatesController extends Controller {

  public function stack($parameters) {
    $province = $parameters['province'];
    $cachePath = __DIR__ . "/../../tmp/cache/candidates/$province.json";

    $query = $this->em->createQueryBuilder()
      ->select('c')
      ->from('Candidate', 'c')
      ->where('c.province = ?1')
      ->setParameter(1, $parameters['province'])
      ->getQuery();

    $candidates = $query->getResult();
    $parties = array();

    shuffle($candidates);

    $data = array(
      'candidates' => array(),
      'parties'    => array()
    );

    foreach ($candidates as $candidate) {
      $party = $candidate->getParty();
      $parties[$party->getId()] = $party;

      $data['candidates'][] = array(
        'id'        => $candidate->getId(),
        'name'      => utf8_encode($candidate->getName()),
        'party_id'  => $party->getId(),
        'image_url' => $candidate->getImageUrl()
      );
    }

    foreach ($parties as $id => $party) {
      $data['parties'][] = array(
        'id'        => $party->getId(),
        'name'      => utf8_encode($party->getName()),
        'logo_url'  => $party->getLogoUrl()
      );
    }

    return $data;
  }

}