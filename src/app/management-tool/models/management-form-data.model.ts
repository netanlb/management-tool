export interface ManagementFormData {
  title: string;
  action: 'add' | 'edit';
  inputs?: { name: string; color: string; description: string };
}
