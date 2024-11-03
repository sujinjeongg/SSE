import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Result = () => {
    return (
        <div style={{ position: 'relative' }}>
            <div className="container-fluid" style={{ backgroundColor: '#000', color: 'white', padding: '20px' }}>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-light" style={{ width: '150px', height: '30px', fontSize: '0.9rem', marginRight: '43px', marginTop: '21px', paddingTop: '0', paddingBottom: '0' }}>
                        <b>New Project</b>
                    </button>
                    <i className="bi bi-house-fill" style={{ fontSize: '2rem', marginRight: '26px', marginTop: '10px' }}></i>
                    <i className="bi bi-person-circle" style={{ fontSize: '2rem', marginRight: '25px', marginTop: '10px' }}></i>
                    <i className="bi bi-gear" style={{ fontSize: '2rem', marginRight: '5px', marginTop: '10px' }}></i>
                </div>
                <h3 style={{ marginTop: '30px' }}>Result</h3>
            </div>
            <div className="container-fluid" style={{ position: 'absolute', top: '220px', width: '50%', marginLeft: '590px' }}>
                <div className="row">
                    <div className="col">
                        <select className="form-select" aria-label="Default select example">
                            <option selected>input01_modified.c</option>
                            <option value="1">input02_modified.c</option>
                            <option value="2">input03_modified.c</option>
                            <option value="3">input04_modified.c</option>
                        </select>
                    </div>
                    <div className="col">
                        <button className="btn btn-primary" type="submit">Download.zip</button>
                    </div>
                </div>
            </div>
            <div className="card" style={{ position: 'absolute', top: '280px', marginLeft: '430px', width: '50%' }}>
                <div className="card-header">
                    input01_modified.c
                </div>
                <div className="card-body">
                    <pre className="bg-light p-3" style={{ height: '550px', overflowY: 'auto' }}>
                        <code>
                            {`#include <stdio.h>
#include <stdlib.h>

// 연결 리스트의 노드를 정의
struct Node {
    int data;
    struct Node* next;
};

// 새 노드를 리스트 끝에 추가하는 함수
void append(struct Node** head_ref, int new_data) {
    // 새 노드를 할당
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    struct Node* last = *head_ref; // 마지막 노드 탐색에 사용

    new_node->data = new_data;
    new_node->next = NULL; // 새 노드는 마지막 노드이므로 NULL

    // 리스트가 비어 있으면 새 노드를 헤드로 설정
    if (*head_ref == NULL) {
        *head_ref = new_node;
        return;
    }

    // 마지막 노드를 찾기
    while (last->next != NULL) {
        last = last->next;
    }

    // 마지막 노드의 다음을 새 노드로 연결
    last->next = new_node;
}

// 리스트에서 특정 값을 가진 첫 번째 노드를 삭제하는 함수
void deleteNode(struct Node** head_ref, int key) {
    struct Node* temp = *head_ref, *prev;

    // 헤드 노드가 삭제할 노드인 경우 처리
    if (temp != NULL && temp->data == key) {
        *head_ref = temp->next; // 헤드를 다음 노드로 이동
        free(temp); // 헤드 삭제
        return;
    }

    // 삭제할 노드를 찾기
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }

    // 리스트에 key가 없는 경우
    if (temp == NULL) return;

    // 노드를 리스트에서 제거
    prev->next = temp->next;
    free(temp); // 메모리 해제
}

// 연결 리스트를 출력하는 함수
void printList(struct Node* node) {
    while (node != NULL) {
        printf(" %d ->", node->data);
        node = node->next;
    }
    printf(" NULL\n");
}

int main() {
    struct Node* head = NULL;

    // 노드들을 연결 리스트에 추가
    append(&head, 1);
    append(&head, 2);
    append(&head, 3);
    append(&head, 4);

    printf("Created Linked list: ");
    printList(head);

    // 특정 값의 노드 삭제
    deleteNode(&head, 2);
    printf("Linked list after deletion of 2: ");
    printList(head);

    return 0;`}
                        </code>
                    </pre>
                    <a href="#" className="btn btn-primary">Edit</a>
                    <a href="#" className="btn btn-primary">Log Record</a>
                    <a href="#" className="btn btn-primary" style={{ marginLeft: '500px' }}>Download</a>
                </div>
            </div>
        </div>
    );
}

export default Result;
