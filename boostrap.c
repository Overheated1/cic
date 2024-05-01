#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {

    // Check if enough arguments provided
    if (argc < 2) 
    {
        fprintf(stderr, "Usage: %s <dockerfile_path> <image_name> <command>\n", argv[0]);
        return 1;
    }

    // Build the Docker image from the provided Dockerfile
    char build_command[256];
    if (system("systemctl start docker.service") != 0) 
    {
        perror("failed to start docker service\n");
    }
    snprintf(build_command, sizeof(build_command), "docker build -f %s -t stylerhun/multi-server", argv[1]);
    printf("RUNNING: %s\n",build_command);
    if (system(build_command) != 0) 
    {
        perror("docker build failed\n");
        return 1;
    }

    // Run the container with the provided command
    char run_command[256];
    snprintf(run_command, sizeof(run_command), "docker run -it -p %s stylerhun/multi-server", argv[2]);
    printf("RUNNING: %s\n",build_command);
    if (system(run_command) != 0) 
    {
        perror("docker run failed\n");
        return 1;
    }

    printf("Successfully built and ran the container.\n");
    return 0;
}
// "docker build -f dockerfile.dev -t stylerhun/multi-server"
// "docker run -it -p 4003:5432 stylerhun/multi-server"
// system("systemctl start docker.service");