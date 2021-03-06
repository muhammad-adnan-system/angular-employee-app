import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../employee.service';
import { Department } from '../models/department';
import { Employee } from '../models/employee';
import { Manager } from '../models/manager';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService, private toastr: ToastrService, private router: Router) { }

  submitted: boolean = false;
  employee: Employee = new Employee();
  departments: Department[] = [];
  managers: Manager[] = [];
  id: number = 0;
  errorMessage:string[]=[];
  ngOnInit(): void {
    this.getDepartments();
    this.getManagers();
  }

  createEmployee() {
    
    this.validation();
    this.employeeService
      .createEmployee(this.employee).subscribe({
        next: data => {
          this.toastr.success("Employee is created Successfuly !");
          this.employee = new Employee();
          this.gotoList();

        },
        error: error => {
          this.errorMessage= error.error;
          console.error('There was an error!', error.error);
        }
      })
  }

  gotoList() {
    this.router.navigate(['/employees']);
  }

  public phoneOnlyValidator(event: any): boolean {
    const pattern = /^[0-9-]+$/;
    if (!pattern.test(event.target.value)) {
      return false;
    }
    return true;
  }

  getDepartments() {
    this.employeeService.getDepartments().subscribe(data => {

      if (data["data"] != null && data["data"] != undefined) {
        this.departments = data["data"];
      }
    })
  }

  getManagers() {
    this.employeeService.getManagers().subscribe(data => {

      if (data["data"] != null && data["data"] != undefined) {
        this.managers = data["data"];
      }
    })
  }

  changeDepartment(e: any) {
    this.employee.department.id = e.target.value;
  }

  changeManager(e: any) {
    this.employee.manager.id = e.target.value;
  }

  validation() {

    if (this.employee.department.id == 0) {
      this.toastr.warning("Please Select Department");
      return;
    }

    if (!this.employee.hireDate) {
      this.toastr.warning("Please Select Hire Date");
      return;
    }

    if (this.employee.manager.id == 0) {
      this.toastr.warning("Please Select Manager");
      return;
    }

  }

}
