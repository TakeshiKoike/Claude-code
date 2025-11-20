import { NextRequest, NextResponse } from 'next/server';
import { getScenario, getChoicesForScenario } from '@/lib/game';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scenarioId = parseInt(params.id);

    if (isNaN(scenarioId)) {
      return NextResponse.json(
        { error: 'Invalid scenario ID' },
        { status: 400 }
      );
    }

    const scenario = getScenario(scenarioId);

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    const choices = getChoicesForScenario(scenarioId);

    return NextResponse.json({
      scenario,
      choices,
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
