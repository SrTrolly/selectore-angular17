import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { Subscriber, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit, OnDestroy {

  public myForm: FormGroup = this.fb.group({
    region: ["", Validators.required],
    country: ["", Validators.required],
    borders: ["", Validators.required],
  });

  public countriesByRegion: SmallCountry[] = [];

  private subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private countrySerivce: CountryService
  ) { }

  ngOnInit(): void {
    this.onRegionChanges();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  get regions(): Region[] {
    return this.countrySerivce.regions;
  }

  private onRegionChanges() {
    this.subscription.add(this.myForm.get("region")?.valueChanges
      .pipe(
        switchMap(region => this.countrySerivce.getCountriesByRegion(region))
      ).subscribe(response => {
        this.countriesByRegion = response;
      })
    )

  }


}
