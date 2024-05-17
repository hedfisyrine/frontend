import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../data.service'; 

@Component({
  selector: 'table-cmp',
  moduleId: module.id,
  templateUrl: 'table.component.html'
})
export class TableComponent implements OnInit {
  title = 'frontend';
  authors: any[] = [];
  articles: any[] = [];
  loadingArticles = false;
  errorFetchingArticles = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchAuthors();
    this.fetchArticles();
  }

  fetchAuthors() {
    this.apiService.getAuthors().subscribe((data: string) => {
      const authorsArray = data.split('\n').map((author: string) => JSON.parse(author));
      this.authors = authorsArray;
    });
  }

  async fetchArticles() {
    this.loadingArticles = true;
    this.errorFetchingArticles = false;

    try {
      this.articles = await this.apiService.getArticles().toPromise();
      this.loadingArticles = false;
    } catch (error) {
      console.error('Error fetching articles:', error);
      this.loadingArticles = false;
      this.errorFetchingArticles = true;
    }
  }
}
