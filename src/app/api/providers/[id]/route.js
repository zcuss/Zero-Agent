import { NextResponse } from "next/server";
import {
  deleteConnectionById,
  getConnectionById,
  updateConnectionById,
} from "@/features/providers/server/connectionRouteHandlers";

// GET /api/providers/[id] - Get single connection
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    return await getConnectionById(id);
  } catch (error) {
    console.log("Error fetching connection:", error);
    return NextResponse.json({ error: "Failed to fetch connection" }, { status: 500 });
  }
}

// PUT /api/providers/[id] - Update connection
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    return await updateConnectionById(id, body);
  } catch (error) {
    console.log("Error updating connection:", error);
    return NextResponse.json({ error: "Failed to update connection" }, { status: 500 });
  }
}

// DELETE /api/providers/[id] - Delete connection
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    return await deleteConnectionById(id);
  } catch (error) {
    console.log("Error deleting connection:", error);
    return NextResponse.json({ error: "Failed to delete connection" }, { status: 500 });
  }
}
