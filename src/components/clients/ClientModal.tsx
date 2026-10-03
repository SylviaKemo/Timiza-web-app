'use client';

import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, TextInput } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import type { Client } from '@/lib/types';
import { useAppStore, type ClientInput } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: ClientInput = { name: '', contact: '', email: '', phone: '', website: '' };

type FormErrors = Partial<Record<keyof ClientInput, string>>;

function validate(values: ClientInput, existing: Client[]): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Company name is required.';
  else if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    errors.name = 'A client with this name already exists.';
  }
  if (!values.contact.trim()) errors.contact = 'Contact name is required.';
  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  return errors;
}

/** "Add client" modal. New clients are immediately available in every client dropdown. */
export function ClientModal() {
  const open = useUiStore((s) => s.clientModalOpen);
  return open ? <ClientForm /> : null;
}

function ClientForm() {
  const clients = useAppStore((s) => s.data.clients);
  const createClient = useAppStore((s) => s.createClient);
  const { closeClientModal, showToast, highlightClient, resetClientFilters } = useUiStore.getState();

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const fieldProps = (key: keyof ClientInput) => ({
    value: values[key],
    invalid: !!errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [key]: value }));
      setErrors((err) => ({ ...err, [key]: undefined }));
    },
  });

  const submit = () => {
    const nextErrors = validate(values, clients);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const client = createClient(values);
    closeClientModal();
    resetClientFilters();
    highlightClient(client.id);
    showToast(`${client.name} added — now available when creating projects`);
  };

  return (
    <Modal
      title="Add client"
      onClose={closeClientModal}
      footer={
        <>
          <Button onClick={closeClientModal}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            Add client
          </Button>
        </>
      }
    >
      <Field label="Company name" required error={errors.name}>
        <TextInput autoFocus placeholder="e.g. Acme Inc." {...fieldProps('name')} />
      </Field>
      <Field label="Contact name" required error={errors.contact}>
        <TextInput placeholder="e.g. Sarah Mitchell" {...fieldProps('contact')} />
      </Field>
      <Field label="Email" error={errors.email}>
        <TextInput type="email" placeholder="sarah@acme.com" {...fieldProps('email')} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <TextInput type="tel" placeholder="+1 555 010 2030" {...fieldProps('phone')} />
        </Field>
        <Field label="Website">
          <TextInput placeholder="acme.com" {...fieldProps('website')} />
        </Field>
      </div>
    </Modal>
  );
}
