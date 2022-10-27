using { Currency, managed, sap } from '@sap/cds/common';
//namespace my.bookshop;

context my.bookshop {

entity Books : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  books  : Association to many Books on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}


entity Student {
    key STDID : Integer;
    name      : String(80);
    gender    : String(10);
    title     : String(5);
}

entity StudentStatus {
    key STDID : Integer;
        active : Boolean;
}

}


@cds.persistence.exists 
@cds.persistence.calcview
Entity ![V_NEW] {
key     ![STDID]: Integer  @title: 'STDID: STDID' ; 
key     ![NAME]: String(80)  @title: 'NAME: NAME' ; 
key     ![TITLE]: String(5)  @title: 'TITLE: TITLE' ; 
key     ![ACTIVE]: Boolean  @title: 'ACTIVE: ACTIVE' ; 
}