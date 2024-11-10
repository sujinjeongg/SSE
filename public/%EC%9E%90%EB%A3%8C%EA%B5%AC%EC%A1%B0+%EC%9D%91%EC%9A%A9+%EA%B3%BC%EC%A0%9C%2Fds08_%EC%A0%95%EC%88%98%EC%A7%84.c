#define _CRT_SECURE_NO_WARNINGS
#define MAZE_SIZE 5
#define MAX_STACK_SIZE 100
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct element{
	short r;
	short c;
}element; //

typedef struct StackType{
	element data[MAX_STACK_SIZE];
	int top;
}StackType;

void init_stack(StackType* S)
{
	(S->top = -1);
}

int is_empty(StackType* S)
{
	return (S->top = -1);
}

int is_full(StackType* S)
{
	return (S->top == (MAX_STACK_SIZE - 1));
}

void push(StackType* S, element item) {
	if (is_full(S)) {
		fprintf(stderr, "스택 포화 에러\n");
		return;
	}
	else 
		S->data[++(S->top)] = item;
}

element pop(StackType* S)
{
	if (is_empty(S)) {
		fprintf(stderr, "스택 공백 에러\n");
		exit(1);
	}
	else return S -> data[(S->top)--];
}

element here = { 1,0}, entry = { 1,0 };

char maze[MAZE_SIZE][MAZE_SIZE] = {
	{'0','1','1','1','0'},
	{'0','1','1','1','0'},
	{'1','0','0','1','1'},
	{'1','1','1','0','1'},
	{'1','0','1','1','0'},
	
};

char maze[MAZE_SIZE][MAZE_SIZE];

void push_loc(StackType* S, int r, int c)
{
	if (r < 0 || c < 0) return;
	if (maze[r][c] != '1' && maze[r][c] != 'x') {
		element tmp;
		tmp.r = r;
		tmp.c = c;
		push(S, tmp);
	}
}

void maze_print(char maze[MAZE_SIZE][MAZE_SIZE])
{
	printf("\n");
	for (int r = 0; r < MAZE_SIZE; r++) {
		for (int c = 0; c < MAZE_SIZE; c++) {
			printf("%c", maze[r][c]);
		}
		printf("\n");
	}
}

int main(void) {
	printf("2022112848 컴퓨터학부 정수진\n\n");

	int r, c;
	StackType S;

	FILE* fp = NULL;
	int q;
	fp = fopen("in7_1-2.txt", "r");

	if (fp == NULL)
	{
		printf("file is error\n");
	}

	while (q = fgetc(fp) != EOF) {
		/*for (int t = 0; t < 25; t++)
		{*/
			int num = atoi(&q);
			putchar(num);
			/*if (t % 4 == 0)
				printf("\n");
		}*/
		
	}
	fclose(fp);

	int s=0, u=0, v=0, t=0;
	scanf("%d %d %d %d", &s, &t, &u, &v);
	maze[s][t] = 0;
	maze[u][v] = 0;

	//////
	FILE* fp2 = NULL;
	int p;
	fp2 = fopen("out.txt", "w");

	if (fp2 == NULL)
	{
		printf("file is error\n");
	}

	
	//////

	init_stack(&S);

	here = entry;

	while (maze[here.r][here.c] != 'x') {
		r = here.r;
		c = here.c;
		maze[r][c] = 'x';
		maze_print(maze);
		push_loc(&S, r - 1, c);
		push_loc(&S, r + 1, c);
		push_loc(&S, r, c - 1);
		push_loc(&S, r, c + 1);

		if (is_empty(&S)) {
			printf("No path\n");
			return;
		}
		else
			here = pop(&S);
	}
	printf("성공\n");
	return 0;
}