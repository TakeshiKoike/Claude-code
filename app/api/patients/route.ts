import { NextRequest, NextResponse } from 'next/server';
import { getAllPatients, createPatient, insertSamplePatients, getPatientsByDifficulty } from '@/lib/patients';

// サンプルデータを初期化
insertSamplePatients();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');

    let patients;
    if (difficulty) {
      patients = getPatientsByDifficulty(difficulty);
    } else {
      patients = getAllPatients();
    }

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.age || !body.gender || !body.chief_complaint || !body.current_symptoms) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています: name, age, gender, chief_complaint, current_symptoms' },
        { status: 400 }
      );
    }

    const patient = createPatient(body);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Failed to create patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
