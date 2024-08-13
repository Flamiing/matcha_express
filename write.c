#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>


void ft_putchar(char c) {
    if (write(1, &c, 1) == -1) {
        perror("write");
        exit(errno);
    }
}

void print_row(int col, char start, char middle, char end) {
    int i;

    i = 0;
    while (i < col) {
        if (i == 0)
            ft_putchar(start);
        else if (i == col - 1)
            ft_putchar(end);
        else
            ft_putchar(middle);
        i++;
    }
    ft_putchar('\n');
}

void rush(int row, int col) {
    int i;

    i = 0;
    while (i < row) {
        if (i == 0)
            print_row(col, '/', '-', '\\');
        else if (i == row - 1)
            print_row(col, '\\', '-', '/');
        else
            print_row(col, '|', ' ', '|');
        i++;
    }
}

int verify_input(char *val) {
    char *endptr;
    long int_val;

    errno = 0;
    int_val = strtol(val, &endptr, 10);

    if (endptr == val || *endptr != '\0') {
        printf("Error: input must be an integer\n");
        exit(EXIT_FAILURE);
    }
    if (errno == ERANGE || int_val > INT_MAX || int_val < INT_MIN) {
        printf("Error: input out of range\n");
        exit(EXIT_FAILURE);
    }
    if (int_val <= 0) {
        printf("Error: input must be a positive integer\n");
        exit(EXIT_FAILURE);
    }
    return (int_val);
}

int main(int argc, char **argv) {
    if (argc != 3) {
        printf("Usage: %s <row> <col>\n", argv[0]);
        return (1);
    }
    int row = verify_input(argv[1]);
    int col = verify_input(argv[2]);
    
    printf("row: %d, col: %d\n", row, col);
    rush(row, col);
}
