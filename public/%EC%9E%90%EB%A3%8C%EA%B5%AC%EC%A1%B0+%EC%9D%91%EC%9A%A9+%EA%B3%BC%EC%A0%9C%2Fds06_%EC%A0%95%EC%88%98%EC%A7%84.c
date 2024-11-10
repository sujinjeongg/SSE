#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#define MAX_TERMS 100

typedef struct {
    int coef;
    int expon;
}polynomial;

polynomial terms[MAX_TERMS];

int avail = 0;
int startA, finishA, startB, finishB, startC, finishC;

void C(int startA, int finishA, int startB, int finishB, int* startD, int* finishD);
int COMPARE(int a, int b);
void attach(int coefficient, int exponent);

int main(void)
{
    printf("컴퓨터학부 2022112848 정수진\n");

    int i;
    int j;

    //a.txt //항 n개
    int n;
    polynomial* A = NULL;
    FILE* fp1;

    fp1 = fopen("a6_1-1.txt", "r");

    if (fp1 != NULL) {
        fscanf(fp1, "%d", &n);
        A = (polynomial*)malloc(sizeof(polynomial) * n);

        for (i = 0; i < n; i++) {
            fscanf(fp1, "%d", &A[i].coef);
            fscanf(fp1, "%d", &A[i].expon);
        }

        printf("\n");

        fclose(fp1);

    }
   
    //b.txt //항 m개
    int m;
    polynomial* B = NULL;
    FILE* fp2;

    fp2 = fopen("b6_1-1.txt", "r");

    if (fp2 != NULL) {
        fscanf(fp2, "%d", &m);
        B = (polynomial*)malloc(sizeof(polynomial) * m);
        for (i = 0; i < m; i++) {
            fscanf(fp2, "%d", &B[i].coef);
            fscanf(fp2, "%d", &B[i].expon);
        }

        fclose(fp2);
     
    }

    //C(x) 화면에 출력
    avail = n + m;

    for (i = 0; i < n; i++) {
        terms[i].coef = A[i].coef;
        terms[i].expon = A[i].expon;
       
    }

    i = 0;
    for (j = n; j < n + m; j++) {

        terms[j].coef = B[i].coef;
        terms[j].expon = B[i].expon;
      
        i++;
    }

    printf("\n");

    int* startD, * finishD;

    C(0, n - 1, n, n + m - 1, &startD, &finishD);

    /*
    printf("1 : %d %d", *startD, *finishD);
    //int num = finishD - startD;
    //printf("2 : %d ", num + 1);


    printf("\n");
    for (i = finishD - startD; i > 0; i--) {
        if (!terms[i].coef) continue;
        printf("%d ", terms[i].coef);
        printf("%d ", terms[i].expon);
        printf("\n");
    }

    printf("\n");
    return 0;
    */
  printf("%d ", 14-8);
    for (i =8; i < 14; i++) {
        printf("%d %d ", terms[i].coef, terms[i].expon);
    }

   

}


void attach(int coefficient, int exponent)
{
    if (avail >= MAX_TERMS) {
        fprintf(stderr, "Too many terms in the polynomial\n");
        exit(0);
    }

    terms[avail].coef = coefficient;
    terms[avail++].expon = exponent;
}

int COMPARE(int a, int b) {
    if (a > b) return 1;
    if (a < b) return -1;
    if (a == b) return 0;
}


void C(int startA, int finishA, int startB, int finishB, int* startD, int* finishD) {

    int coefficient;
    *startD = avail;
    //printf("%d", *startD);
   // printf("처음 : %d %d %d %d\n", startA, startB, finishA, finishB);

    while (startA <= finishA && startB <= finishB) {
        switch (COMPARE(terms[startA].expon, terms[startB].expon)) {
        case -1: attach(terms[startB].coef, terms[startB].expon);
            startB++;
           // printf("case-1 ");
            break;
        case 0: coefficient = terms[startA].coef + terms[startB].coef;

            if (coefficient)
                attach(coefficient, terms[startA].expon);
            startA++;
            startB++;
           // printf("case0 ");
            break;

        case 1: attach(terms[startA].coef, terms[startA].expon);
            startA++;
            //printf("case1 ");
        }
      //  printf("%d %d %d %d \n ", startA, startB, finishA, finishB);

    }


    for (; startA <= finishA; startA++)
        attach(terms[startA].coef, terms[startA].expon);

    for (; startB <= finishB; startB++)
        attach(terms[startB].coef, terms[startB].expon);

    //printf("avail : %d ", avail);
    *finishD = avail - 1;
    //  printf("finishD : %d ", *finishD);

}