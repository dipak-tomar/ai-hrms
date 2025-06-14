import { Request, Response } from "express";
import { employeeService } from "../services/employee.service";

class EmployeeController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { employee, user, temporaryPassword } = await employeeService.createEmployee(req.body);
      const result = {
        message: "Employee created successfully.",
        employee,
        user: { id: user.id, email: user.email, role: user.role },
        ...(temporaryPassword && { temporaryPassword }),
      };
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Error creating employee" });
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const employees = await employeeService.getAllEmployees();
      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching employees", error });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching employee", error });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const employee = await employeeService.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ message: "Error updating employee", error });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      await employeeService.deleteEmployee(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error deleting employee", error });
    }
  }
}

export const employeeController = new EmployeeController();