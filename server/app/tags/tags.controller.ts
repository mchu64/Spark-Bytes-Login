import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';

export const get_tags = async (_: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const create_tag = async (req: Request, res: Response) => {
  const { name, color, type_id } = req.body;
  try {
    const existingTag = await prisma.tag.findFirst({
      where: {
        name,
      },
    });

    if (existingTag) {
      return res
        .status(400)
        .json({ error: 'Tag with this name already exists' });
    }

    // If type_id is provided, connect the tag to an existing Tag_type
    // If type_id is not provided, it means a new Tag_type should be created
    let tagType;
    if (type_id) {
      tagType = { connect: { id: type_id } };
    } else {
      const typeName = req.body.typeName;
      const existingType = await prisma.tag_type.findFirst({
        where: { name: typeName },
      });

      if (existingType) {
        tagType = { connect: { id: existingType.id } };
      } else {
        const newType = await prisma.tag_type.create({
          data: { name: typeName },
        });
        tagType = { connect: { id: newType.id } };
      }
    }

    const newTag = await prisma.tag.create({
      data: {
        name,
        color,
        type: tagType,
      },
    });

    return res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const tag_type_create = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newTagType = await prisma.tag_type.create({
      data: {
        name,
      },
    });

    res.status(201).json(newTagType);
  } catch (error) {
    console.error('Error creating tag type:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
//this route will help you fetch one tag type depending on the name entered. So it acts as a sort of filter and could be useful later.
//to fetch all tag types from the database refer to the route - /api/all-tag-types
export const get_tag_types_by_name = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    const tagType = await prisma.tag_type.findFirst({
      where: {
        name: name as string,
      },
    });

    res.json(tagType);
  } catch (error) {
    console.error('Error fetching tag type:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//this route will help you fetch all tag types present in the database
export const get_all_tag_types = async (_: Request, res: Response) => {
  try {
    const tagTypes = await prisma.tag_type.findMany();
    res.json(tagTypes);
  } catch (error) {
    console.error('Error fetching tag types:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
