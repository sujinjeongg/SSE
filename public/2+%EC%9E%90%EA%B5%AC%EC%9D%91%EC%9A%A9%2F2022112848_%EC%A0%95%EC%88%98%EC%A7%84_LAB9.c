#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

void add(Node** head, int data);
void print(Node** equivalence, int n);
void free_class(Node** equivalence, int n);
int find_class(Node** equivalence, int n, int item);

int main() {
    FILE* input1;
    input1 = fopen("input1.txt", "r");
    if (input1 == NULL)
        printf("input1 file is error\n");

    int n, i, a, b;
    char c;

    fscanf(input1, "%d", &n);
    Node** equiv = (Node**)malloc(n * sizeof(Node*));
    for (i = 0; i < n; i++) {
        equiv[i] = NULL;
    }

    for (i = 0; i < n; i++) {
        fscanf(input1, "%d %c %d", &a, &c, &b);
        int class_a = find_class(equiv, i, a);
        int class_b = find_class(equiv, i, b);
        if (class_a == -1 && class_b == -1) {
            if (a <= b) { //작은 숫자부터 넣기
                add(&equiv[i], a);
                add(&equiv[i], b);
            }
            else if (a >= b) {
                add(&equiv[i], b);
                add(&equiv[i], a);
            }
        }
        else if (class_a != -1 && class_b == -1) {
            add(&equiv[class_a], b);
        }
        else if (class_a == -1 && class_b != -1) {
            add(&equiv[class_b], a);
        }
        else if (class_a != class_b) {
            Node* current = equiv[class_b];
            while (current != NULL) {
                add(&equiv[class_a], current->data);
                current = current->next;
            }
            free_class(&equiv[class_b], 1);
        }
    }

    int cnt = n;
    for (i = 0; i < n; i++) {
        if (equiv[i] == NULL) {
            cnt--;
        }
    }

    print(equiv, cnt);
    free_class(equiv, n);

    return 0;
}

void add(Node** head, int data)
{
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->next = NULL;
    newNode->data = data;
    if (*head == NULL)
        *head = newNode;
    else {
        Node* tmp = *head;
        while (tmp->next != NULL)
            tmp = tmp->next;
        tmp->next = newNode;
    }
}

void print(Node** equivalence, int n) {
    FILE* output1;
    output1 = fopen("output1.txt", "w");
    if (output1 == NULL)
        printf("output1 file is error\n");

    fprintf(output1, "%d\n", n);

    Node* head;
    for (int i = 0; i < n; i++) {
        head = equivalence[i];
        fprintf(output1, "{");
        while (head != NULL) {
            if (head->next != NULL)
                fprintf(output1, "%d, ", head->data);
            else
                fprintf(output1, "%d", head->data);

            head = head->next;
        }
        fprintf(output1, "}");
        if (i != (n - 1)) {
            fprintf(output1, ", ");
        }
    }
}

void free_class(Node** equivalence, int n) {
    for (int i = 0; i < n; i++) {
        Node* current = equivalence[i];
        while (current != NULL) {
            Node* next = current->next;
            free(current);
            current = next;
        }
    }
    free(equivalence);
}

int find_class(Node** equivalence, int n, int item) {
    for (int i = 0; i < n; i++) {
        Node* current = equivalence[i];
        while (current != NULL) {
            if (current->data == item) {
                return i;
            }
            current = current->next;
        }
    }
    return -1;
}
