#define _CRT_SECURE_NO_WARNINGS
#include<stdio.h>
#include<stdlib.h>

int main()
{
    //�ܰ�1
    printf("��ǻ���к� 2022112848 ������\n");

    //�ܰ�2
    FILE* in, * out;
    int n = 0;
    int k = 0;
    int num;

    fopen_s(&in, "in.txt", "r");
    fopen_s(&out, "out.txt", "w");

    if (in == NULL) {
        printf("in.txt error\n");
        return 0;
    }

    if (out == NULL) {
        printf("out.txt error\n");
        return 0;
    }

    fscanf_s(in, "%d", &n);

    //�ܰ�3
    printf("n: %d\n", n);

    //�ܰ�4
    int* L = (int*)malloc(sizeof(int) * n);

    //�ܰ�5
    for(int i = 0; i < n; i++)
    {
        fscanf_s(in, "%d", &num);
        L[k] = num;
        k++;
    }

    //�ܰ�6
    int min = L[0];
    for (int i = 1; i < n; i++)
    {
        if (L[i] < min)
            min = L[i];
    }
    printf("���� ���� ��: %d\n", min);

    for (int i = 0; i < n; i++) {
        for (int k = i + 1; k < n; k++) {
            if (L[i] > L[k]) {
                int secondmin = L[i];
                L[i] = L[k];
                L[k] = secondmin;
            }
        }
    }
    printf("�ι�°�� ���� ��: %d\n", L[1]);

    //�ܰ� 7
    int x;
    do
    {
        scanf("%d", &x);
    } while (x <= 0);

    printf("%d�� ���: ", x);
    fprintf_s(out, "%d�� ���: ", x);

    for (k = 0; k < n; k++)
    {
        if (L[k] % x == 0)
        {
            printf("%d ", (L[k]));
            fprintf(out, "%d ", (L[k]));
        }
    }
    fclose(in);
    fclose(out);

    return 0;
}