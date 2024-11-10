#define _CRT_SECURE_NO_WARNINGS
#define MAX_TERMS 101
#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>

typedef struct {                         //��� ���Ҹ� �����ϱ� ���� ����ü term ����
    int row;
    int col;
    int value;
} term;

void smTranspose(term a[], term b[]);
void fast_transpose(term a[], term b[]);

void smTranspose(term a[], term b[]) {
    int i, j, currentb;

    b[0].col = a[0].row;                 // ��ġ��� b�� �� �� = ������ a�� �� ��
    b[0].row = a[0].col;                 // ��ġ��� b�� �� ��= ������ a�� �� ��
    b[0].value = a[0].value;             // ��ġ��� b�� ���� �� = ������ a���� 0�� �ƴ� ���Ҽ�

    if (a[0].value > 0) {                  //0�� �ƴ� ���Ұ� �ִ� ��쿡�� ��ġ ���� ����
        currentb = 1;
        for (i = 0; i < a[0].col; i++)            //������ a�� ������ ��ġ �ݺ� ����
            for (j = 1; j <= a[0].value; j++)   //0�� �ƴ� ���� ���� ���ؼ��� �ݺ� ����
                if (a[j].col == i) {                    //������ ���� ���ϴ� ���Ұ� ������ b[]�� ����
                    b[currentb].row = a[j].col;
                    b[currentb].col = a[j].row;
                    b[currentb].value = a[j].value;
                    currentb++;
                }
    }
}

int main() {
    printf("��ǻ���к� 2022112848 ������\n");

    int i=0, j=0;
    /*   term A[11] = { {8,7,10}, {0,2,2}, {0,6,12}, {1,4,7}, {2,0,23}, {3,3,31}, {4,1,14}, {4,5,25}, {5,6,6}, {6,0,52}, {7,4,11} };
       term B[11];*/

       //m1-1.txt 
    int n;
    term* A =NULL;
    term* B =NULL;
    FILE* fp1= fopen("m1-1", "r");
  
   // fopen("m1-1", "rt");
   // fread(&A, sizeof(A), 1, fp1);
    A = (term**)malloc(sizeof(term)*(A[0].row*A[0].col+4));

    if (fp1 == NULL) {
        printf("file is error\n");
        return 1;
    }

    if (fp1 != NULL) {

        A = (term*)malloc(sizeof(term) * (A[0].row * A[0].col + 4));

        fscanf(fp1, "%d", &A[0].row);
        fscanf(fp1, "%d", &A[0].col);
        fscanf(fp1, "%d", &A[0].value);

       for (int i = 1; i < A[0].value; i++){
                fscanf(fp1,"%d", &A[i].value);
            }
        }

        printf("\n");

        fclose(fp1);

        smTranspose(A, B);

        printf("%d  %d  %d\n", A[0].row, A[0].col, A[0].value);

        for (i = 1; i < A[0].value; i++) {
            printf("%d  %d  %d\n", A[i].row, A[i].col, A[i].value);
        }
        //printf("\n\n");


       /* smTranspose(A, B);

        printf("Transpose processing has been finished.\n");
        printf("\n\n");

        printf("���� ��: %d, ���� ��: %d, 0�� �ƴ� ���� ��: %d\n", B[0].row, B[0].col, B[0].value);

        for (i = 1; i < 11; i++)
            printf("��: %d, ��: %d, ��: %d\n", B[i].row, B[i].col, B[i].value);*/
            //printf("\n\n");

            //

         /*   fast_transpose(A, B);



            printf("���� ��: %d, ���� ��: %d, 0�� �ƴ� ���� ��: %d\n", A[0].row, A[0].col, A[0].value);

            for (i = 1; i < 11; i++)
                printf("��: %d, ��: %d, ��: %d\n", A[i].row, A[i].col, A[i].value);
            printf("\n\n");*/

        FILE* fp2 = fopen("m2-1", "w");

        fast_transpose(A, B);

        printf("Transpose processing has been finished.\n");
        printf("\n\n");

        fprintf("%d  %d  %d\n", B[0].row, B[0].col, B[0].value);

        for (i = 1; i < A[0].value + 1; i++) //
            fprintf("%d  %d  %d\n", B[i].row, B[i].col, B[i].value);
        //printf("\n\n");

        fclose(fp2);
        return 0;
    }


 void fast_transpose(term a[], term b[]) {
        int row_terms[MAX_TERMS];
        int starting_pos[MAX_TERMS] ;
        int i, j;
        int num_col = a[0].col;
        int num_terms = a[0].value;

        b[0].row = num_col;
        b[0].col = a[0].row;
        b[0].value = num_terms;

        if (num_terms > 0) {
            for (i = 0; i < num_col; i++) {
                row_terms[i] = 0;  // A ����� �� ���� ��ŭ row_terms�� �迭�� 0���� �ʱ�ȭ -.
                //printf("row_terms[%d]= %d\n", i, row_terms[i]);
            }
            printf("\n\n");
            for (i = 1; i <= num_terms; i++) {
                row_terms[a[i].col]++; // A ����� �� �ε����� �ش��ϴ� row_terms�� �迭�� 1�� �ʱ�ȭ -
                //printf("row_terms[a[%2d].col]  =row_terms[%d] = %d\n", i, a[i].col, row_terms[a[i].col]);
            }
            printf("\n\n");
            starting_pos[0] = 1;

            for (i = 1; i < num_col; i++) {
                starting_pos[i] = starting_pos[i - 1] + row_terms[i - 1];
                //printf("starting_pos[%d]= %d\n", i, starting_pos[i]);
            }
            // printf("\n\n");

            for (i = 0; i < num_col; i++) {
                //printf("starting_pos[%d]= %d\n", i, starting_pos[i]);
            }
            // printf("\n\n");

            for (i = 1; i <= num_terms; i++) {
                j = starting_pos[a[i].col]++;

                //printf("j = %2d = starting_pos[a[%2d].col]++ = starting_pos[%d]++\n", j, i, a[i].col);

                b[j].row = a[i].col;
                b[j].col = a[i].row;
                b[j].value = a[i].value;
            }
        }
    }