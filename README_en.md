# 📚 People Management System

A complete system developed in C++ to manage student and teacher information with command-line interface, advanced search functionalities, and data persistence.

## ✨ Features

### 🎯 Main Features
- **People Registration**: Complete registration of students and teachers
- **Intelligent Search**: Search by name (partial) or CPF
- **Organized Listings**: View by category or general
- **Birthday Tracking**: Query birthday people by specific month
- **Automatic Persistence**: Saving to text files
- **Data Validation**: CPF, date, and data entry verification
- **Memory Management**: Dynamic control with leak prevention

### 👨‍🎓 Student Data
- Full name
- CPF (automatically formatted)
- Date of birth
- Registration number

### 👨‍🏫 Teacher Data
- Full name
- CPF (automatically formatted)
- Date of birth
- Academic degree (Especialista, Mestre, Doutor)

## 🚀 How to Use

### Prerequisites
- C++ compiler with C++17 support or higher
- Operating system: Windows, Linux, or macOS

### Compilation
```bash
g++ -std=c++17 -o sistema-gerenciamento-pessoas-cpp main.cpp
```

### Execution
```bash
./sistema-gerenciamento-pessoas-cpp
```

## 📖 Main Menu

```
MENU PRINCIPAL
0 - Salvar Dados
1 - Cadastrar uma Pessoa
2 - Listar Todas as Pessoas
3 - Pesquisar por Nome
4 - Pesquisar por CPF
5 - Excluir Pessoa
6 - Apagar Todas as Pessoas Cadastradas
7 - Aniversariantes do Mês
8 - Mostrar Status do Programa
9 - Sair do Programa
```

## 🏗️ System Architecture

### Main Classes

#### `Utils`
Utility class with helper functions:
- CPF formatting and cleaning
- Safe data reading
- User interface (screen clearing, pauses, etc.)

#### `Data`
Complete date management:
- Date validation
- Leap year calculation
- Date formatting
- Specific month verification

#### `Pessoa` (Abstract Base Class)
- Basic attributes: name, CPF, date of birth
- Virtual methods for data reading and writing
- Base for Student and Teacher inheritance

#### `Aluno` (Inherits from Pessoa)
- Specific attribute: matrícula
- Static quantity counter
- Specific input/output implementation

#### `Professor` (Inherits from Pessoa)
- Specific attribute: titulação
- Academic title validation
- Static quantity counter

#### `Sistema`
Main system operations:
- Registration, search, listing
- Individual and mass deletion
- Birthday search

#### `GerenciamentoDados`
Data persistence:
- Saving to text files
- Loading on initialization
- File error handling

#### `Menus`
User interface:
- Main menu and submenus
- Intuitive navigation
- Input validation

## 💾 Data Storage

### Generated Files
- `alunos.txt`: Student data
- `professores.txt`: Teacher data

### File Format
```
[quantidade_de_registros]
[nome]
[cpf]
[dia] [mes] [ano]
[campo_especifico] // matrícula for students, titulação for teachers
```

## 🔍 Detailed Features

### Search
- **By Name**: Partial search (substring)
- **By CPF**: Exact search with automatic formatting

### Validations
- **CPF**: Accepts formats with or without mask
- **Dates**: Complete validation including leap years
- **Limits**: Maximum of 100 people per category

### Birthday Tracking
- Search by specific month (1-12)
- Separate listing: students, teachers, or all
- Organized display with person type

## ⚠️ Important Notes

### Limitations
- Maximum of 100 students and 100 teachers
- Year validation between 1900 and 2100
- Portuguese-only interface

### Recommendations
- Always save data after registration/deletion operations
- Keep backups of data files
- Use correct format for CPF and dates

## 🛠️ Technical Features

### Applied Concepts
- **Object-Oriented Programming**: Inheritance, polymorphism, encapsulation
- **Memory Management**: Dynamic allocation with `new`/`delete`
- **Exception Handling**: `try`/`catch` for critical operations
- **Files**: Reading and writing text files
- **STL**: Use of `vector`, `string`, and algorithms

### Design Patterns
- **Template Method**: Virtual methods in `Pessoa`
- **Singleton-like**: Static utility classes
- **Strategy**: Different implementations for Aluno/Professor

## 📝 Usage Example

```cpp
// Register a new student
Aluno* novoAluno = new Aluno("João Silva", "123.456.789-00", 15, 3, 2000, "2024001");

// Search by name
sistema.pesquisarPorNomeAluno(); // Type: "João"

// List birthday people
sistema.listarTodosAniversariantes(3); // March
```

## 🤝 Contributions

This project was developed as an educational system demonstrating fundamental concepts of C++ and object-oriented programming. Suggestions and improvements are welcome!

---

**Developed in C++** | **CLI Interface** | **File Persistence**