import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { Subscriber, Subscription, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit, OnDestroy {

  public myForm: FormGroup = this.fb.group({
    region: ["", Validators.required],
    country: ["", Validators.required],
    border: ["", Validators.required],
  });

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  private subscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private countrySerivce: CountryService
  ) { }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  get regions(): Region[] {
    return this.countrySerivce.regions;
  }

  private onRegionChanged() {
    this.subscription.add(this.myForm.get("region")?.valueChanges
      .pipe(
        tap(() => this.myForm.get("country")?.setValue("")),
        tap(() => this.borders = []),
        switchMap(region => this.countrySerivce.getCountriesByRegion(region))
      ).subscribe(response => {
        this.countriesByRegion = response;
      })
    )

  }

  private onCountryChanged(): void {
    this.myForm.get("country")?.valueChanges
      .pipe(
        tap(() => this.myForm.get("border")?.setValue("")),
        filter((value: string) => value.length > 0),
        switchMap((alphaCode) => this.countrySerivce.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this.countrySerivce.getCountryBordersByCodes(country.borders))
      )
      .subscribe(countries => {
        this.borders = countries
      });
  }


}
