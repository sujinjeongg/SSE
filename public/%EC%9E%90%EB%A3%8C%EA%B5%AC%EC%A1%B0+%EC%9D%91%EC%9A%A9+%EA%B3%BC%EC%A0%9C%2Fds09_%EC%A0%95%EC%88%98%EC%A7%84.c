#define _CRT_SECURE_NO_WARNINGS
#define MAX_STACK_SIZE 100
#define MAX_QUEUE_SIZE 5
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

typedef int element;

//STACK함수들
typedef struct {
	element* data;
	int capacity;
	int top;
}StackType;

void init_stack(StackType* s) {
	s->top = -1;
	s->capacity = 1;
	s->data = (element*)malloc(s->capacity * sizeof(element));
}

int is_empty(StackType* s) {
	return s->top == -1;
}

int is_full(StackType* s) {
	return (s->top == (s->capacity - 1));
}

void push(StackType* s, element item) {
	if (is_full(s)) {
		s->capacity *= 2;
		s->data = (element*)realloc(s->data, s->capacity * sizeof(element));
	}
	s->data[++(s->top)] = item;
}

element pop(StackType* s) {
	if (is_empty(s)) {
		fprintf(stderr, "스택 공백 에러\n");
		exit(1);
	}
	else return s->data[(s->top)--];
}

//QUE함수들
typedef struct {
	element *qdata;
	int front, rear;
}QueueType;

void error(char* message) {
	fprintf(stderr, "%s\n", message);
	exit(1);
}

void init_queue(QueueType* q) {
	q->front = q->rear = 0;
}

int qis_empty(QueueType* q) {
	return (q->front == q->rear);
}

int qis_full(QueueType* q) {
	return (q->rear % MAX_QUEUE_SIZE == q->front);
}

void queue_print(QueueType* q) {
	if (!qis_empty(q)) {
		int i = q->front;
		do {
			i = (i + 1) % (MAX_QUEUE_SIZE);
			printf("%d ", q->qdata[i]);
			if (i == q->rear) {
				break;
			}
		} while (i != q->front);
	}
}

void enqueue(QueueType* q, element item) {
	if (qis_full(q))
	{
		printf("que full "); 
		for (int i = q->front; i <= q->rear; i++) {
			printf("%d ", q->qdata[i]);
		}
		
	}
	q->rear = (q->rear + 1) % MAX_QUEUE_SIZE;
	q->qdata[q->rear] = item;
}

element dequeue(QueueType* q) {
	/*if (is_empty(q))
		error("큐가 공백상태입니다.");*/
	q->front = (q->front + 1) % MAX_QUEUE_SIZE;
	return q->qdata[q->front];
}

int main(void) {
	printf("2022112848 컴퓨터학부 정수진\n\n");

	FILE* fp;
	fp = fopen("in9-2.txt", "r");

	if (fp == NULL)
	{
		printf("file is error\n");
		exit(1);
	}

	//문제1
	StackType s;
	init_stack(&s);

	int c = 0;
	element num = 0;
	c = fgetc(fp);

	while (!feof(fp)) {
		if (c == 'a') {
			fscanf(fp, "%d", &num);
			push(&s, num);
		}

		if (c == 'd') {
			pop(&s);
		}

		fgetc(fp);
		c = fgetc(fp);
	}

   //문제2
	
	   /* QueueType que;
		init_queue(&que);
	
		int cq = 0;
		element numq = 0;

		fseek(fp, 0, SEEK_SET);
        cq = fgetc(fp);

		while (!feof(fp)) {
	
			if (cq == 'a') {
				fscanf(fp, "%d", &numq);
			    enqueue(&que, numq);
		}

			if (cq == 'd') {
				dequeue(&que);
			}

		fgetc(fp);
		cq = fgetc(fp);
		}*/

	//화면 출력
		printf("문제1 : ");
		for (int i = 0; i <= s.top; i++) {
			printf("%d ", s.data[i]);
		}
		printf("\n");

		printf("문제2 : 실행되지않음(포화상태로 뜸) ");
		/*for (int i = que.front; i <= que.rear; i++) {
			printf("%d ",que.qdata[i]);
		}*/


		free(s.data);
		fclose(fp);
		return 0;
}