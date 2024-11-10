#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define num 100

int COMPARE(int a, int b)
{
    if (a < b)
        return -1;

    if (a > b)
        return 1;

    if (a == b)
        return 0;
}

int main(void) {
    printf("2022112848 컴퓨터학부 정수진\n");

    //step 1
    int n = 0, min = 0, max = 0;

    printf("\nn,min,max값 입력 : ");

    scanf("%d %d %d", &n, &min, &max);
    
    int searchnumber, i;

    printf("n = ");
    scanf("%d", &n);

    int* a = ((int*)malloc(sizeof(int) * (n)));

    a[0] = 0;

    printf("\n%d ", a[0]);

    for (i = 1; i < n; i++)
    {

        a[i] = a[i - 1] + (rand() % max + min);

        printf("%d ", a[i]);

    }

    //step6
    for (int j = 0; j < 100; j++){
    printf("\nsearch number : ");

    scanf("%d", &searchnumber);

    //step 2
    if (searchnumber == -1)
        return 1;

    //step 3
 clock_t start, finish;
 double elapsed;
 start = clock();
   
    int sequential_index;

    sequential_index = sequential_search(a, searchnumber, 0, n-1);
    printf("sequential search number : %d", sequential_index);

 finish = clock();
 elapsed = ((double)(finish)-(double)(start)) / CLOCKS_PER_SEC;
 printf("(time: %f)\n", elapsed * 1000.0);

    //step 4
 start = clock();

    int iterative_index;
    iterative_index =iterative_search(a, 0, n-1, searchnumber);

    if (searchnumber == -1)
        printf("\niterative search number : -1\n");
        //printf("-1\n");
    else printf("\niterative search number : %d", iterative_index);

finish = clock();
elapsed = ((double)(finish)-(double)(start)) / CLOCKS_PER_SEC;
printf("(time: %f)\n", elapsed * 1000.0);

    //step 5
start = clock();

    int recursive_index;
    recursive_index = recursive_search(a, 0, n-1, searchnumber);

    if (recursive_index == -1)
        printf("\nrecursive search number : -1");
    else printf("\nrecursive search number : %d", recursive_index);

finish = clock();
elapsed = ((double)(finish)-(double)(start)) / CLOCKS_PER_SEC;
printf("(time: %f)\n", elapsed * 1000.0);
}
    return 0;
}

int sequential_search(int arr[], int middle, int left, int right)
{
    for (int i = left; i <= right; i++)
    {
        if (arr[i] == middle)
        {
            return i;
        }
        
    }
    return -1;
}

int iterative_search(int arr[], int left, int right, int answer)
{
    while (left <= right)
    {
        int mid = (left + right) / 2;

        if (arr[mid] < answer)
            left = mid + 1;

        else if (arr[mid] > answer)
            right = mid - 1;

        else return mid;
    }
    return -1;
}


int recursive_search(int arr[], int left, int right, int answer)
{
    int mid = (left + right) / 2;

    if (left > right)      
        return -1;

    if (arr[mid] < answer)
        return recursive_search(arr, mid + 1, right, answer);
    else if (arr[mid] > answer)
        return recursive_search(arr, left, mid - 1, answer);
    else
        return mid;
}






