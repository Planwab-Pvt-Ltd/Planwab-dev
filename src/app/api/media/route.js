import { NextResponse } from "next/server";

// This file is now deprecated - use /api/vendor/[id]/posts and /api/vendor/[id]/reels instead
// Keeping minimal version for backward compatibility

export async function GET() {
  return NextResponse.json({
    success: false,
    error: "This endpoint is deprecated. Use /api/vendor/[id]/posts or /api/vendor/[id]/reels",
  }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({
    success: false,
    error: "This endpoint is deprecated. Use /api/vendor/[id]/posts or /api/vendor/[id]/reels",
  }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({
    success: false,
    error: "This endpoint is deprecated. Use /api/vendor/[id]/posts or /api/vendor/[id]/reels",
  }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({
    success: false,
    error: "This endpoint is deprecated. Use /api/vendor/[id]/posts or /api/vendor/[id]/reels",
  }, { status: 410 });
}