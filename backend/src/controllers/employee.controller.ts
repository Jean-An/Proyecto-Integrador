import { Request, Response } from 'express';
import { Employee } from '../models';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving employees', error });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.destroy();
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};
