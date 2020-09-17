import { expect } from "chai";
import { Vector3 } from "three";
import { Cube } from "./Cube";
import { RubiksCube } from "./RubiksCube";

// ['L', 'R', 'D', 'U', 'F', 'B'];


describe("Cubes", () => {
    const rubiks = new RubiksCube();
    const origFront = rubiks.getAllCubesOfGroup('F');
    const fdl = rubiks.getCubeByGroups(['F', 'L', 'D']);
    it("should rotate on the four on the front when F is chagmed", () => {
        expect(rubiks.findDuplicated().length).to.eq(0);

        //expect(JSON.stringify(cube.position)).to.equal(JSON.stringify(new Vector3(1, 0, 0)), "Nooooooo");
    });
    it("should rotate the front down left clockwise and change down to up", () => {
        expect(JSON.stringify(fdl.position)).to.equal(JSON.stringify(new Vector3(-1, -1, -1)));

        fdl.rotateGroup('F', 1);
        expect(JSON.stringify(fdl.position)).to.equal(JSON.stringify(new Vector3(-1, 1, -1)));
        expect(fdl.getAllGroups()).to.contain.all.members(['L', 'U', 'F']);
    });
    it("should rotate the luf as left group clockwise and change up to down", () => {
        fdl.rotateGroup('L', -1);
        expect(JSON.stringify(fdl.position)).to.equal(JSON.stringify(new Vector3(-1, -1, -1)));
        expect(fdl.getAllGroups()).to.contain.all.members(['L', 'D', 'F']);
    });
})
