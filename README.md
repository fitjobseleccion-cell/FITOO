# FitJob Database Migrations

## Overview

This directory contains PocketBase database migrations for the FitJob job offers platform.

## Migration Files

### 001_create_collections.js

Creates the complete database schema with 12 collections:

1. **users** - System users with roles (candidato, admin, super_admin, reclutador)
2. **ofertas** - Job offers with full details and metadata
3. **candidatos** - Job applications with scoring and status tracking
4. **preguntas_cribado** - Screening questions for job offers
5. **respuestas_cribado** - Candidate answers to screening questions
6. **criterios_puntuacion** - Scoring criteria for job offers
7. **estados_candidato** - Candidate status change history
8. **notificaciones** - User notifications
9. **correos_enviados** - Email sending log
10. **archivos** - File storage for CVs and cover letters
11. **historial_cambios** - Audit trail for all changes
12. **configuracion** - System configuration settings

## Running Migrations

### Via PocketBase Admin Panel

1. Go to Settings → Migrations
2. Click "Create new migration"
3. Copy the migration code
4. Click "Run"

### Via PocketBase CLI

```bash
pocketbase migrate up
```

### Via API

Migrations can be triggered programmatically through PocketBase API endpoints.

## Database Features

### Security Rules

- **users**: Only admins can create/edit, users can edit their own profile
- **ofertas**: Only admins/recruiters can create, view published offers
- **candidatos**: Users can only view their own applications
- **archivos**: Only accessible by admin and file owner
- **historial_cambios**: Read-only audit trail (immutable)

### Validations

- Email format validation on users and candidatos
- Phone number validation (9-15 digits)
- DNI/NIE format validation (Spanish ID)
- Salary range validation (min <= max)
- File size and type validation
- **MANDATORY**: permiso_trabajo must be true for all candidatos

### Indexes

All collections have optimized indexes for common queries:
- Email (unique)
- Status fields
- Date fields
- Foreign key relationships

### Default Configuration

The migration creates default system configuration:
- Max CV size: 5MB
- Max cover letter size: 2MB
- Allowed formats: PDF, DOC, DOCX
- Candidate expiration: 180 days
- Min preselection score: 50%
- Sender email: noreply@fitjob.es
- Work permit requirement: mandatory

## Hooks and Automations

The following automations should be implemented via PocketBase hooks:

### On Candidato Creation
- Validate permiso_trabajo = true (reject if false)
- Auto-calculate score from screening answers
- Create notification for recruiter
- Send confirmation email to candidate
- Register in historial_cambios

### On Candidato Status Change
- Register change in estados_candidato
- Create notification for candidate
- Send status change email
- Register in historial_cambios

### On Oferta Creation
- Register in historial_cambios
- Create default scoring criteria

### On Oferta Deletion
- Mark as 'cerrada' instead of hard delete
- Register in historial_cambios

## Field Relationships

```
users
  ├── cv_archivo → archivos
  ├── carta_presentacion_archivo → archivos
  └── (referenced by many collections)

oferta
  ├── preguntas_cribado
  ├── criterios_puntuacion
  └── creada_por → users

candidatos
  ├── oferta_id → ofertas
  ├── usuario_id → users
  ├── cv_archivo → archivos
  ├── carta_presentacion_archivo → archivos
  ├── respuestas_cribado
  └── entrevistador → users

preguntas_cribado
  ├── oferta_id → ofertas
  └── criterio_puntuacion_id → criterios_puntuacion

respuestas_cribado
  ├── candidato_id → candidatos
  └── pregunta_id → preguntas_cribado

estados_candidato
  ├── candidato_id → candidatos
  └── cambio_realizado_por → users

notificaciones
  ├── usuario_id → users
  ├── candidato_id → candidatos
  └── oferta_id → ofertas

correos_enviados
  ├── usuario_id → users
  ├── candidato_id → candidatos
  └── oferta_id → ofertas

archivos
  └── candidato_id → users

historial_cambios
  └── usuario_id → users
```

## Notes

- All timestamps use ISO 8601 format
- All IDs are auto-generated UUIDs
- Soft deletes are used for ofertas (mark as 'cerrada')
- Hard deletes are prevented for audit trail integrity
- permiso_trabajo is mandatory for all job applications