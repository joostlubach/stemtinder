<?php

class CandidatesController extends Controller {

  public function stack($parameters) {
    $province = $parameters['province'];
    $cachePath = __DIR__ . "/../../tmp/cache/candidates/$province.json";

    if (file_exists($cachePath) && time() - filemtime($cachePath) < 60) {
      header('Content-Type: application/json');
      header('X-Cached: true');
      readfile($cachePath);
    } else {
      header('X-Cached: false');

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
          'name'      => $candidate->getName(),
          'party_id'  => $party->getId(),
          'image_url' => $candidate->getImageUrl()
        );
      }

      foreach ($parties as $id => $party) {
        $data['parties'][] = array(
          'id'        => $party->getId(),
          'name'      => $party->getLongName(),
          'logo_url'  => $party->getLogoUrl()
        );
      }

      file_put_contents($cachePath, json_encode($data));

      return $data;
    }
  }

}