using { my.bookshop as my } from '../db/schema';
using  V_NEW  from '../db/schema';
service CatalogService @(path:'/browse') {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
    } excluding { createdBy, modifiedBy };

    action submitOrder (book:Books:ID, amount: Integer);

    entity Student as projection on my.Student;

     entity StudentStatus as projection on my.StudentStatus;

    entity Genres as projection on my.Genres;

    @readonly 
    entity V_New as projection on V_NEW;

  }

  

