import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Model } from './model';
import { FirebaseServiceService } from './firebase-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  myForm: FormGroup;
  
  constructor(
    private service : FirebaseServiceService
    ) { }

  model: Model[];
  submitted = false;

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl('Isra'),
      password: new FormControl('')
    });

    this.service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.model = data;
      console.log(data);
    });
    
  }

  onSubmit(form: FormGroup) {
    this.service.create(form.value).then(() => {
      console.log('Created new item successfully!' + form.value);
      this.submitted = true;
    });
  }

  message = '';

  edit(){
    this.service.update("-MUtkPFbeYUenGPbEuZD" ,this.myForm.value)
      .then(() => this.message = 'The tutorial was updated successfully!')
      .catch(err => console.log(err));
  }
}
