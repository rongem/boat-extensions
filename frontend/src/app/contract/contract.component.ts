import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Boat3Service } from '../lib/boat3.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {

  constructor(private boat: Boat3Service, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.boat.getContracts().pipe(take(1)).subscribe();
  }

}
