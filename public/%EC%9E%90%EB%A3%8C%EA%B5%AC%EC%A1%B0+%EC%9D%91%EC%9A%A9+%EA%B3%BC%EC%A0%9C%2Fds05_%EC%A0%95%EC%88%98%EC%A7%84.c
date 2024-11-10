#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
	printf("컴퓨터학부 2022112848 정수진\n\n");

	int i = 0, j = 0, r, c, n;
	int** M;
	int* S;

	//in.txt
	FILE* fp1;

	fp1 = fopen("in5_1_in-1.txt", "r");

	if (fp1 == NULL) {
		printf("file open error\n");
	}

	fscanf(fp1, "%d", &r);
	fscanf(fp1, "%d", &c);

	M = (int**)malloc(sizeof(*M) * r);

	for (i = 0; i < r; i++)
	{
		M[i] = (int*)malloc(c * sizeof(**M));
		for (j = 0; j < c; j++)
		{
			fscanf(fp1, "%d", &M[i][j]);
		}
	}

	fclose(fp1);

	//key.txt

	FILE* fp2;

	fp2 = fopen("in5_1_key-1.txt", "r");



	if (fp2 == NULL) {
		printf("file open error\n");
	}
	fscanf(fp1, "%d", &n);

	S = (int*)malloc(sizeof(int) * n);

	for (i = 0; i < n; i++)
	{
		fscanf(fp2, "%d", &S[i]);
	}
	fclose(fp2);


	int k;

	for (int i = 0; i < r; i++)
	{
		for (int j = 0; j < c; j++)
		{
			for (k = 0; k < n; k++) {
				if (M[i][j + k] != S[k]) {	
					break;
				}      
				if (i == (r - 1) && (j == (c - 1)) && S[n] != S[k]) {
					printf("(-1,-1)\n"); //strange
			   }        
			} //printf("%d %d %d\n", i, j, k);
			
			if (k == n) {
				printf("(%d %d)\n", i, j);
			}
						
		}
				
	}
	
}
