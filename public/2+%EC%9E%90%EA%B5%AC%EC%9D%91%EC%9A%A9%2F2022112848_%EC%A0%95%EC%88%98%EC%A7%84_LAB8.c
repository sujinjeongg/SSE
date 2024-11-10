#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#define MAX 20

typedef struct listnode {
	int coef;
	int exp;
	struct listnode* next;
}listnode;

typedef struct listhead {
	listnode* head;
}listhead;

void insert_last(listhead* L, int coef, int exp);
void add_poly(listhead* A, listhead* B, listhead* C);
void print(listhead* L);

void insert_last(listhead* L, int coef, int exp) {
	listnode* node = (listnode*)malloc(sizeof(listnode));
	listnode* tmp;
	node->coef = coef;
	node->exp = exp;
	node->next = NULL;
	if (L->head == NULL) {
		L->head = node;
		return;
	}
	else {
		tmp = L->head;
		while (tmp->next != NULL)
			tmp = tmp->next;
		tmp->next = node;
	}
}

void add_poly(listhead* A, listhead* B, listhead* C) {
	listnode* tmpA = A->head;
	listnode* tmpB = B->head;
	int sum = 0;

	while (tmpA && tmpB) {
		if (tmpA->exp > tmpB->exp) {
			insert_last(C, tmpA->coef, tmpA->exp);
			tmpA = tmpA->next;
		}
		else if (tmpA->exp == tmpB->exp) {
			sum = tmpA->coef + tmpB->coef;
			insert_last(C, sum, tmpA->exp);
			tmpA = tmpA->next;
			tmpB = tmpB->next;
		}
		else {
			insert_last(C, tmpB->coef, tmpB->exp);
			tmpB = tmpB->next;
		}
	}
	for (; tmpA != NULL; tmpA = tmpA->next)
		insert_last(C, tmpA->coef, tmpA->exp);
	for (; tmpB != NULL; tmpB = tmpB->next)
		insert_last(C, tmpB->coef, tmpB->exp);
}

void print(listhead* L) {
	FILE* output1;
	output1 = fopen("output1.txt", "w");
	if (output1 == NULL)
		printf("output1 file is error\n");

	listnode* tmp = L->head;
	for (; tmp; tmp = tmp->next)
		fprintf(output1, "%d %d\n", tmp->coef, tmp->exp);
}

int main() {
	FILE* input1;
	input1 = fopen("input1.txt", "r");
	if (input1 == NULL)
		printf("input1 file is error\n");

	int n = 0, m = 0;
	fscanf(input1, "%d", &n);
	fscanf(input1, "%d", &m);

	listhead* A = (listhead*)malloc(sizeof(listhead));
	A->head = NULL;
	listhead* B = (listhead*)malloc(sizeof(listhead));
	B->head = NULL;
	listhead* C = (listhead*)malloc(sizeof(listhead));
	C->head = NULL;

	int num_coef = 0, num_exp = 0;
	for (int i = 0; i < n; i++) {
		fscanf(input1, "%d", &num_coef);
		fscanf(input1, "%d", &num_exp);
		insert_last(A, num_coef, num_exp);
	}

	for (int i = 0; i < m; i++) {
		fscanf(input1, "%d", &num_coef);
		fscanf(input1, "%d", &num_exp);
		insert_last(B, num_coef, num_exp);
	}

	add_poly(A, B, C);
	print(C);
	return 0;
}