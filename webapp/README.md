# ESLint Boundaries

This application follows a modular architecture to ensure clear separation of concerns and maintainability. The structure enforces strict boundaries between shared utilities, feature-specific modules, and application-specific components, making the codebase scalable and easy to navigate.

## Project Structure

The application is divided into three main modules:

- **Shared**: Contains reusable code that is shared across the application.
- **Feature**: Contains domain-specific features (e.g., `auth`, `settings`).
- **App**: Contains application-specific code like routes and APIs.

### Folder Structure

```
src/
├── actions/
├── components/
├── constants/
├── hooks/
├── lib/
├── providers/
├── auth.config.ts
├── auth.ts
├── features/
│   ├── auth/
│   └── settings/
└── app/
    ├── admin/
    ├── client/
    ├── server/
    ├── settings/
    ├── api/
    │   ├── admin/
    │   └── auth/
    └── auth/
        ├── error/
        ├── login/
        ├── new-password/
        ├── new-verification/
        ├── register/
        └── reset/
```

## ESLint Boundaries Rules

The rules for `eslint-plugin-boundaries` ensure:

1. **Shared Modules** can be used by all other modules.
2. **Feature Modules** can use shared modules and the `auth` feature but not other features.
3. **App Modules** can use shared and feature modules but should not import other app modules.

## How to Use

To explore the implementation, see the ESLint configuration file [here](./eslint.config.mjs).

## Diagram

Below is a visual representation of the module relationships enforced by the ESLint boundaries:

![scssecos-auth-eslint-boundaries](https://github.com/user-attachments/assets/6aabe2ac-c258-4c8a-ab30-084765a54cb2)



### Key Points:

- **Shared** modules are the core and can be accessed by all other modules.
- **Feature** modules focus on domain-specific functionality and may depend on the `auth` feature.
- **App** modules integrate features and serve as the entry points for routes and APIs.

## Getting Started

Check this [README.md](../README.md)
