import { Component } from '@angular/core';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  previewImage: string | null = null;  // Para almacenar la imagen cargada
  fileName: string = 'Upload your image here (máx. 2 MB)';

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();  // Simula el clic en el input file cuando se hace clic en el textarea
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar el tamaño del archivo (máximo 2 MB)
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previewImage = e.target.result;  // Asigna la imagen cargada
        };

        reader.readAsDataURL(file);  // Leer el archivo como URL de datos
        this.fileName = file.name;  // Actualiza el nombre del archivo en el textarea
      } else {
        alert('The file is too large. The maximum size allowed is 2 MB.');
        this.fileName = 'Upload your image here (máx. 2 MB)';  // Restablece el valor si es demasiado grande
        this.previewImage = null;
      }
    }
  }

  model2!: string;

	constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) {}

  email: string = 'nerm.frontend@gmail.com';
  phone: string = '520 834 4316';

  priceHour: number = 20;  // Precio por hora
  items: Array<any> = [
    { description: '', qty: 0, hours: 0, total: 0 },
    { description: '', qty: 0, hours: 0, total: 0 },
    { description: '', qty: 0, hours: 0, total: 0 },
    { description: '', qty: 0, hours: 0, total: 0 }
  ];
  subTotal: number = 0;

  // Actualiza el total por cada fila
  updateTotal(index: number): void {
    const item = this.items[index];
    item.total = item.qty * item.hours * this.priceHour;
    this.updateSubTotal();
  }

  // Actualiza el subtotal sumando todos los totales
  updateSubTotal(): void {
    this.subTotal = this.items.reduce((acc, item) => acc + item.total, 0);
  }

  exportPDF() {
    const data = document.getElementById('invoice');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('invoice.pdf');
      });
    }
  }

}
