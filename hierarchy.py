from collections import defaultdict
import json
import os

def tree():
    return defaultdict(tree)

def add_element(hierarchy, path):
    node = hierarchy
    for part in path:
        node = node[part]

def hide_children(hierarchy, path, hidden_hierarchy):
    node = hierarchy
    hidden_node = hidden_hierarchy
    for part in path[:-1]:
        node = node[part]
        hidden_node = hidden_node[part]
    hidden_node[path[-1]] = node[path[-1]]
    node[path[-1]].clear()

def show_element(hierarchy, path, hidden_hierarchy):
    node = hierarchy
    hidden_node = hidden_hierarchy
    for part in path[:-1]:
        node = node[part]
        hidden_node = hidden_node[part]
    node[path[-1]] = hidden_node[path[-1]]
    hidden_node[path[-1]].clear()

def print_hierarchy(hierarchy, indent=0):
    for key, value in hierarchy.items():
        print(' ' * indent + key)
        print_hierarchy(value, indent + 4)

def save_hierarchy(hierarchy, file_path):
    regular_dict = json.loads(json.dumps(hierarchy))
    with open(file_path, 'w') as file:
        json.dump(regular_dict, file, indent=2)

def convert_to_tree(regular_dict):
    return defaultdict(tree, {k: convert_to_tree(v) for k, v in regular_dict.items()})

def load_hierarchy(file_path):
    with open(file_path, 'r') as file:
        regular_dict = json.load(file)
    return convert_to_tree(regular_dict)


def main():
    hierarchy = tree()
    hidden_hierarchy = tree()

    file_path = 'hierarchy.json'
    try:
        hierarchy = load_hierarchy(file_path)
    except FileNotFoundError:
        print("No previous hierarchy found.")

    while True:
        print("\nMenu:")
        print("1. Show hierarchy")
        print("2. Add element")
        print("3. Hide element")
        print("4. Show element")
        print("5. Exit")
        choice = input("Choose an option: ")

        if choice == '1':
            print_hierarchy(hierarchy)
        elif choice == '2':
            path = input("Enter the path to the new element (e.g., Programming/Python): ").split('/')
            add_element(hierarchy, path)
        elif choice == '3':
            path = input("Enter the path to the element to hide (e.g., Programming/Python): ").split('/')
            hide_children(hierarchy, path, hidden_hierarchy)
        elif choice == '4':
            path = input("Enter the path to the hidden element to show (e.g., Programming/Python): ").split('/')
            show_element(hierarchy, path, hidden_hierarchy)
        elif choice == '5':
            save_hierarchy(hierarchy, file_path)
            print("Exiting program.")
            break
        else:
            print("Invalid choice, please try again.")

if __name__ == '__main__':
    main()
